import { genId } from '@/utils/id';
import BankAccount from '@/models/bank-account';
import { registerBank, registerAccount, getAccountById, getUserById, getBankById } from '@/stores/Registry';

export default class Bank {
  private id: string;
  private accounts: Map<string, BankAccount> = new Map();
  private allowsNegativeBalance: boolean;

  private constructor(allowsNegativeBalance = false) {
    this.id = genId('bank');
    this.allowsNegativeBalance = allowsNegativeBalance;
    registerBank(this.id, this);
  }

  static create(allowsNegativeBalance = false): Bank {
    return new Bank(allowsNegativeBalance);
  }

  getId(): string {
    return this.id;
  }

  createAccount(initialBalance = 0): BankAccount {
    const acct = BankAccount.create(this.id, initialBalance, this.allowsNegativeBalance);
    this.accounts.set(acct.getId(), acct);
    registerAccount(acct.getId(), acct);
    return acct;
  }

  getAccount(accountId: string): BankAccount {
    const acct = this.accounts.get(accountId);
    if (!acct) throw new Error('Account not found');
    return acct;
  }

  send(fromUserId: string, toUserId: string, amount: number, toBankId?: string) {
    if (amount <= 0) throw new Error('Transfer amount must be positive');

    const fromUser = getUserById(fromUserId);
    const toUser = getUserById(toUserId);
    if (!fromUser || !toUser) throw new Error('User not found');

    const destBank = toBankId ? getBankById(toBankId) : this;
    if (!destBank) throw new Error('Destination bank not found');

    const toAcctId = toUser.getAccountIds().find(id => {
      const acct = getAccountById(id);
      return acct && (acct as any).getBankId?.() === destBank.getId();
    });

    if (!toAcctId) throw new Error('Destination account not found for user in destination bank');

    const toAcct = getAccountById(toAcctId)!;

    const fromAcctIds = fromUser.getAccountIds().filter(id => {
      const acct = getAccountById(id);
      return acct && (acct as any).getBankId?.() === this.getId();
    });

    if (fromAcctIds.length === 0) throw new Error('Source account not found for user in this bank');

    const primaryAcct = getAccountById(fromAcctIds[0])!;

    const sameBankDestination = destBank.getId() === this.getId();

    if (primaryAcct.canWithdraw(amount)) {
      primaryAcct.withdraw(amount);
      (toAcct as any).deposit(amount);
      (fromUser as any).addAccountIdFront(primaryAcct.getId());
      (toUser as any).addAccountIdFront(toAcct.getId());
      return;
    }

    if (this.allowsNegativeBalance) {
      (primaryAcct as any).forceWithdraw(amount);
      (toAcct as any).deposit(amount);
      (fromUser as any).addAccountIdFront(primaryAcct.getId());
      (toUser as any).addAccountIdFront(toAcct.getId());
      return;
    }

    if (sameBankDestination) {
      let totalAvailable = 0;
      const acctObjs = fromAcctIds.map(id => getAccountById(id)!);
      for (const a of acctObjs) {
        totalAvailable += Math.max(0, (a as any).getBalance());
      }
      if (totalAvailable < amount) {
        throw new Error('Insufficient funds');
      }

      let remaining = amount;
      const deltas: Array<{ acct: any; withdrawAmt: number }> = [];

      for (const a of acctObjs) {
        if (remaining <= 0) break;
        const available = Math.max(0, a.getBalance());
        const take = Math.min(available, remaining);
        if (take > 0) {
          deltas.push({ acct: a, withdrawAmt: take });
          remaining -= take;
        }
      }

      if (remaining > 0) {
        throw new Error('Insufficient funds');
      }

      for (const d of deltas) {
        d.acct.withdraw(d.withdrawAmt);
        (fromUser as any).addAccountIdFront(d.acct.getId());
      }

      (toAcct as any).deposit(amount);
      (toUser as any).addAccountIdFront(toAcct.getId());
      return;
    }

    throw new Error('Insufficient funds');
  }
}
