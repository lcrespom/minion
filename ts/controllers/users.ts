import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {
	preRender() {
		return userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
		});
	}
});
