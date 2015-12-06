#Minion

<p align="center">
	<img src="img/minion.jpg" width="50%">
</p>

Minion is a tiny WebComponent-oriented UI framework. It can be learned very fast and is good enough
for small to medium single-page applications.

Minion does not make use of the WebComponent standard for building the UI, but still the development
approach is based on breaking the Web App into independent and reusable web components. Each component
is defined as:
- An HTML template, containing plain HTML and [Mustache](https://github.com/janl/mustache.js)
	template expressions.
- An optional JavaScript Object or class. If present, several of its methods will be invoked during
	the application lifecycle: when the component is created, after it is rendered and before it is
	removed. Also, components hold data accessible to the template and can handle events triggered
	from elements it contains.

####Hello world example:
#####hello.js in ES5
```JavaScript
	minion.component('my-component', {
		init: function() {
			this.greeting = 'Hello';
		}
	});
```
#####hello.js in ES6
```JavaScript
	minion.component('my-component', class {
		init() {
			this.greeting = 'Hello';
		}
	});
```
#####hello.html
```HTML
	<p>{{greeting}}, world!</p>
```
#####someOtherPage.html
```HTML
	Greeting component below:
	<my-hello></my-hello>
```
#####Output
```HTML
	Greeting component below:
	<p>Hello, world!</p>
```

##Component lifecycle
Components can contain other components. When Minion finds a component tag such as the above
`<my-hello>`, it loads and renders its HTML template, invoking the component methods in a
specific sequence. All lifecycle methods are optional, and most of them are seldom required,
with the exception of the init method:
- **init(componentNode)**: invoked immediately after the component is instantiated. This is where
	the component initializes values to be rendered by the template. A typical case is to invoke
	some remote service in order to retrieve some data from the server. If a
	[Promise](https://www.promisejs.org/) is returned, then Minion will wait for the promise
	to resolve before rendering the template. This ensures that when the template is rendered,
	all data has been properly initialized.
	The HTML node of the component (e.g. `<my-hello>` in the previous example) is passed as
	a jQuery object, so the component can examine its atributes and content before its template
	is rendered.
- **ready(rootNode)**: invoked after the HTML template has been fully rendered, including
	the mustache expansions and any nested components. The rendered template root element
	is passed as a jQuery object, so it can be used to perform DOM manipulations or registering
	event handlers. However, events can also be handled by the mn-click and mn-submit directives,
	so this method is seldom required.
- **done(rootNode)**: Invoked right before the component is removed from the DOM. This is where
	the controller can perform any teardown if required. Notice that event listeners bound to
	elements of the template will be auomatically removed by jQuery, and therefore this method
	is seldom required.

##How Minion gets a template from a component
There are several approaches for specifying the template of a component:
- Default: by using the same name for the component and template. When a component
	registers itself by invoking `minion.component('component-name', ComponentClass)`,
	Minion will load the template from a file called `component-name.html`.
- By defining a `templateUrl` property in the component object: Minion will load the template
	from a file named after the value of that property.
- By defining a `template` property in the component object: Minion will use the property value
	as the template itself. This is useful for small and highly reusable components that make
	use of small templates.
- If a template does not require of a component, the `<mn-view template="templateUrl">` tag
	can be used.
All templates are cached, so they are loaded only once.

##Event handling

###mn-click="*methodName*", mn-submit="*methodName*"
Registers a listener so that *methodName* is invoked in the parent component(s) when the
event takes place.

####Examples:
```HTML
	<form mn-submit="save">
```
Will call the *save* method of the parent component when the form is submitted.
Notice that the method should return false to avoid the browser from posting the
form to the server.

```HTML
	<button mn-click="cancel">
```
Will call the *cancel* method of the current controller when the button is clicked.


##ToDo:
### Development
- ESHint / TSLint
- Minification with proper source maps (webpack plugin is buggy)
- Set TypeScript compile target to ES6 and add Babel as a build step.
	- And maybe the Promise shim will no longer be required.

### Runtime
- Properly setup Modernizr in order to support form validation shims
- Define controller interface (empty?)
- Refactor 'search' views & controller to flat search names
- Test refactor folders by functionality instead of component type
- NLS/multilanguage

##Done:
- Infinitely nested components
- npm scripts with proper build / watch / serve
- Templating engine: Mustache
- Demo: implement full set of CRUD operations for user table
- Config object to specify parameters such as:
	- Base path for loading templates
	- showLoading / hideLoading functions
- Show waiting popup & block current UI
- Added extra HTML escaping to avoid XSS attacks
