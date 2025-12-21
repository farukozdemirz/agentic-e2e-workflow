import { registerState } from "./StateRegistry";
import { assertQuickcartOpen } from "./quickcartOpen";
import { assertCartNotEmpty } from "./cartNotEmpty";
import { assertTotalAmountPositive } from "./totalAmountPositive";
import { STATES } from "../../constants";

registerState(STATES.QUICKCART_OPEN, assertQuickcartOpen);
registerState(STATES.CART_NOT_EMPTY, assertCartNotEmpty);
registerState(STATES.TOTAL_AMOUNT_POSITIVE, assertTotalAmountPositive);
