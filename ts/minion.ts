//-------------------- Exports --------------------

const model = <any>{};

export default {
	model,				// M
	showPage,			// V
	registerComponent,	// V
	registerController	// C
}

//-------------------- Module variables --------------------

const pageCache = {};
const ctrl = {};
const components = {};
const currentCtrls = [];

//-------------------- Publics --------------------

function showPage(page: string, target: JQuery, extra?: string): void {
	console.log(`Showing page '${page}'`);
	closeControllers();
	showView(page, target, extra);
}

function registerController(name: string, controller) {
	ctrl[name] = controller;
}

function registerComponent(name: string, component) {
	components[name] = component;
}


//-------------------- Privates --------------------

function showView(viewName: string, target: JQuery, extra: string): Promise<JQuery> {
	//TODO show waiting animation & block current UI
	return new Promise<JQuery>(resolve => {
		console.log(`  rendering template '${viewName}'`);
		preRenderController(viewName, extra)
		.then(() => {
			return getPage(viewName);
		})
		.then(pageData => {
			const viewContent = $('<div>' + Mustache.render(pageData, model) + '</div>');
			return processSubviews(viewContent, extra);
		})
		.then(viewContent => {
			target.empty().append(viewContent);
			processComponents(viewContent);
			postRenderController(viewName);
			resolve(viewContent);
		});
	});
}

function processSubviews(viewContent: JQuery, extra: string): Promise<JQuery> {
	const showPromises: Promise<JQuery>[] = [];
	return new Promise(resolve => {
		viewContent.find('[mn-subview]').each((i, e) => {
			const subView = $(e);
			showPromises.push(showView(subView.attr('mn-subview'), subView, extra));
		});
		Promise.all(showPromises).then(results => {
			resolve(viewContent);
		});
	});
}

function getPage(page: string): Promise<string> {
	return new Promise(resolve => {
		if (pageCache[page]) {
			resolve(pageCache[page]);
		}
		else {
			$.get('templates/' + page + '.html').done((pageData) => {
				pageCache[page] = pageData;
				Mustache.parse(pageData);
				resolve(pageData);
			});
		}
	});
}

function preRenderController(ctrlName: string, extra: string): Promise<any> {
	if (ctrl[ctrlName]) {
		// Add controller
		// TODO this should be done elsewhere
		const currCtrl = ctrl[ctrlName];
		currCtrl.$name = ctrlName;
		currentCtrls.push(currCtrl);
		// Call prerender
		if (currCtrl.preRender) {
			const result = currCtrl.preRender(extra);
			if (result instanceof Promise) return result;
		}
	}
	return Promise.resolve();
}

function postRenderController(ctrlName: string): void {
	if (!ctrl[ctrlName]) return;
	const currCtrl = ctrl[ctrlName];
	if (currCtrl.postRender) currCtrl.postRender();
}

function closeControllers() {
	while (currentCtrls.length > 0) {
		const ctrl = currentCtrls.pop();
		if (ctrl.done) ctrl.done();
	}
}

function processComponents(viewContent: JQuery) {
	viewContent.find('[mn-component]').each((i, e) => {
		processComponent($(e));
	});
}

function processComponent(node: JQuery) {
	const compName = node.attr('mn-component');
	const component = components[compName];
	if (!component) {
		console.warn(`Component ${compName} not found`);
		return;
	}
	component.render(node);
}