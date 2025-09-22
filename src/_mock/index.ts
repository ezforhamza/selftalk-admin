import { setupWorker } from "msw/browser";
import { mockTokenExpired } from "./handlers/_demo";
import { menuList } from "./handlers/_menu";
import { signIn, userList } from "./handlers/_user";
import { legalHandlers } from "./handlers/_legal";

const handlers = [signIn, userList, mockTokenExpired, menuList, ...legalHandlers];
const worker = setupWorker(...handlers);

export { worker };
