// ✅ REMOVE this line:
// import Stripe from 'stripe';

import axios from 'axios';
import { showAlert } from './alert';

// ✅ Use the Stripe object loaded from https://js.stripe.com/v3/
const stripe = Stripe(
  'pk_test_51Rp02LAf0FfvCL5tzA1Eb9fre4gXyNvihuPbQnEd2Xy5nq7KPxRP6sgpXMnwipKRMHqZ8KKHUIGNpPUDwuKXwad900Agx9S7Ey'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Redirect to Stripe checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
