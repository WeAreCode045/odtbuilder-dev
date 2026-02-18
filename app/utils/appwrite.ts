import { Client, Databases, Account } from 'appwrite';

const client = new Client();

// Configure from environment at runtime. Vite exposes env vars prefixed with VITE_.
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'http://localhost/v1';
const project = import.meta.env.VITE_APPWRITE_PROJECT || '';

client.setEndpoint(endpoint).setProject(project);

const databases = new Databases(client);
const account = new Account(client);

async function register(email: string, password: string, name?: string) {
	// Creates account and returns account info
	// Appwrite v8 uses create for accounts: account.create
	return account.create('unique()', email, password, name ? { name } : undefined);
}

async function login(email: string, password: string) {
	// Create session
	return account.createEmailSession(email, password);
}

async function logout() {
	return account.deleteSessions();
}

async function getAccount() {
	try {
		return await account.get();
	} catch (err) {
		return null;
	}
}

export { client, databases, account, register, login, logout, getAccount };