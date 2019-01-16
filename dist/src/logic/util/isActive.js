import { NON } from "./globals.js";
export function isActive(number) {
    if (number > NON) {
        return true;
    }
    else {
        return false;
    }
}
