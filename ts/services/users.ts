
export default {
	getUsers,
	saveUser,
	deleteUser
}

//-------------------- Public --------------------

interface User {
	name: string,
	surname: string,
	email: string,
	mobile: string,
	id: number
}

function getUsers(filter): Promise<User[]> {
	return new Promise(resolve => {
		setTimeout(()=> {
			const data: User[] = [];
			for (let i = 0; i < 10; i++)
				data.push(createUser(i, filter));
			resolve(data);
		}, 800);
	});
}

function saveUser(u: User): Promise<void> {
	return Promise.resolve(undefined);
}

function deleteUser(id: string): Promise<void> {
	return Promise.resolve(undefined);
}

//-------------------- Public --------------------

function createUser(id: number, filter: User): User {
	const usr: User = <User>{};
	filter = filter || <User>{};
	usr.name = filter.name || randomName(3, 6);
	usr.surname = filter.surname || randomName(4, 7);
	usr.email = filter.email || usr.name + '.' + usr.surname + '@gmail.com';
	usr.mobile = filter.mobile || randomMobile();
	usr.id = id;
	return usr;
}

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

function randomName(min: number, max: number): string {
	let name: string = '';
	let letters: string;
	const len = randomNum(min, max);
	for (let i = 0; i < len; i++) {
		letters = (i % 2 == 0) ? CONSONANTS : VOWELS;
		name += letters[randomNum(0, letters.length)];
		if (name.length == 1) name = name.toUpperCase();
	}
	return name;
}

function randomMobile(): string {
	let num: string = '6';
	for (let i = 1; i < 9; i++) {
		if (i % 3 == 0) num += ' ';
		num += randomNum(0, 10);
	}
	return num;
}

function randomNum(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

