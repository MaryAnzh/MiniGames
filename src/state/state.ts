class AppStore {
  private _isAuth = false;

  get isAuth() {
    return this._isAuth;
  }

  set isAuth(value: boolean) {
    this._isAuth = value;
  }
}

const appStore = new AppStore();
export default appStore;
