export class User {
  id: number
  username: string
  email: string
  name: string
  private _token: string
  private _tokenExpirationDate: Date

  constructor(id: number, username: string, email: string, name: string, token: string, tokenExpirationDate: Date) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.name = name;
    this._token = token;
    this._tokenExpirationDate = tokenExpirationDate;
  }

  get token() {
    if (!this._tokenExpirationDate || (new Date() > this._tokenExpirationDate)) {
      return null;
    }
    return this._token;
  }
}

export interface UserInfo {
  id: number
  username: string
  email?: string
  name?: string
  disabled: boolean
}
