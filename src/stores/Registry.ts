import type BankAccount from '@/models/bank-account';
import type Bank from '@/models/bank';
import type User from '@/models/user';

type BankMap = Map<string, Bank>;
type AccountMap = Map<string, BankAccount>;
type UserMap = Map<string, User>;

const banks: BankMap = new Map();
const accounts: AccountMap = new Map();
const users: UserMap = new Map();

export function registerBank(id: string, bank: Bank) {
  banks.set(id, bank);
}

export function getBankById(id: string): Bank | undefined {
  return banks.get(id);
}

export function registerAccount(id: string, account: BankAccount) {
  accounts.set(id, account);
}

export function getAccountById(id: string): BankAccount | undefined {
  return accounts.get(id);
}

export function registerUser(id: string, user: User) {
  users.set(id, user);
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}
