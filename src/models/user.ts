import { genId } from '@/utils/id';
import { registerUser, getAccountById } from '@/stores/Registry';

export default class User {
  private id: string;
  private name: string;
  private accountIds: string[] = [];

  private constructor(name: string, accountIds: string[]) {
    this.id = genId('user');
    this.name = name;
    this.accountIds = [...accountIds];

    for (const acctId of accountIds) {
      const acct = getAccountById(acctId);
      if (acct) {
        try {
          (acct as any).setOwner?.(this.id);
        } catch {

        }
      }
    }

    registerUser(this.id, this);
  }

  static create(name: string, accountIds: string[]) {
    return new User(name, accountIds);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getAccountIds(): string[] {
    return [...this.accountIds];
  }

  addAccountIdFront(acctId: string) {
    this.accountIds = [acctId, ...this.accountIds.filter(id => id !== acctId)];
  }

  addAccountIdBack(acctId: string) {
    if (!this.accountIds.includes(acctId)) this.accountIds.push(acctId);
  }
}
