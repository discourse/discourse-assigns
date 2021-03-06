import I18n from "I18n";
import UserTopicListRoute from "discourse/routes/user-topic-list";
import cookie from "discourse/lib/cookie";
import { action } from "@ember/object";

export default UserTopicListRoute.extend({
  userActionType: 16,
  noContentHelpKey: "discourse_assigns.no_assigns",

  beforeModel() {
    if (this.currentUser === undefined) {
      cookie("destination_url", window.location.href);
      this.transitionTo("login");
    }
  },

  model(params) {
    return this.store.findFiltered("topicList", {
      filter: `topics/messages-assigned/${this.modelFor("user").get(
        "username_lower"
      )}`,
      params: {
        // core is a bit odd here and is not sending an array, should be fixed
        exclude_category_ids: [-1],
        order: params.order,
        ascending: params.ascending,
        search: params.search,
      },
    });
  },

  titleToken() {
    return I18n.t("discourse_assign.assigned");
  },

  renderTemplate() {
    this.render("user-activity-assigned");
    this.render("user-assigned-topics", { into: "user-activity-assigned" });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("model", model);
  },

  @action
  changeAssigned() {
    this.refresh();
  },
});
