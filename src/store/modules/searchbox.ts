import { Module, VuexModule, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import UserModel from "../models/UserModel";

@Module({
  name: "searchbox",
  dynamic: true,
  store,
  namespaced: true
})
class Searchbox extends VuexModule {
  user: UserModel | null = null;

  get searchbarUser() {
    return this.user;
  }

  @Mutation
  updateUser(user: UserModel | null) {
    this.user = user;
  }

  @Action({ commit: "updateUser" })
  changeTasks(user: UserModel | null) {
    return user;
  }
}

export default getModule(Searchbox);
