<p align="center">
  <img src="https://www.multisafepay.com/img/multisafepaylogo.svg" width="400px" position="center">
</p>

# MultiSafepay Payment Service module for Vue Storefront v1.11.1

MultiSafepay Payments API integration for Vue Storefront with Magento 2.

## About MultiSafepay

MultiSafepay is a collecting payment service provider which means we take care of the agreements, technical details, and payment collection for each payment method. You can start selling online today and manage all your transactions from one place.

![order-status](https://user-images.githubusercontent.com/54272995/77526252-91dddd00-6e8a-11ea-8985-b916a3d067f9.png)

Order status page after the customer has successfullly paid.

# Requirements

To use this module, you need a MultiSafepay account, or [create a test account](https://testmerchant.multisafepay.com/signup).

# Installation guide

To install this module in Vue Storefront, follow these steps:

1. Make sure you meet the [requirements for your Magento 2 installation](https://github.com/MultiSafepay/Magento2Msp), and then follow the installation steps in the README file.

2. Add the Vue Storefront API extension we created for the [MultiSafepay Payments API](https://github.com/MultiSafepay/vsf-multisafepay-service-api), and then  follow the installation steps in the README file.

3. To integrate this module into Vue Storefront, clone this git repository from within your vue-storefront root folder:

```shell
git clone git@github.com:MultiSafepay/vsf-payment-multisafepay.git src/modules/vsf-payment-multisafepay
```

# Register the module 

1. Open `src/modules/client.ts`

2. Add:

```ts
...
import { MultiSafePayPaymentModule } from './vsf-payment-multisafepay'
```

3. Make sure you also register the module in registerClientModules:

```js
registerModule(MultiSafePayPaymentModule);
```

# Add the configuration settings

1. Add the config properties in `config/local.json`

```json
"paymentService": {
"endpoint": "http://localhost:8080/api/ext/vsf-multisafepay-service-api"
},
```

2. Make sure you set the correct location to your API and the routes to the CMS pages in case of an error or an invalid payment status check.

# Integrate the theme

We used the default Vue Storefront theme. If using your own theme, make the following changes. We created isolated components to separate the logic from VSF core you also to make a few small changes on the core.

1. Copy and paste the checkout page as we change one v-show condition of the thank you page to v-if

```html
<thank-you-page v-if="isThankYouPage" />
```

2. As we redirect to the MultiSafepay gateweay after placing the order, VSF shows the default thank you page so copy and paste the file to add a notification on the created method. 

```js
created(){
    this.$bus.$emit('notification-progress-start', [this.$t('Redirecting to MultiSafepay'), '...'].join(''))
  },
```

3. To display Multisafepay payment methods, add the `PaymentMethods` component into the `Payment checkout component` in one of the following two ways:

- Copy and paste the Payment Component from this module to your default theme:

**Or**

- Remove the following code from the Payment Component (core/blocks/Checkout/Payment.vue):

```html
<div v-for="(method, index) in paymentMethods" :key="index" class="col-md-6">
	<label class="radioStyled">
		{{ method.title ? method.title : method.name }}
		<input
			type="radio"
			:value="method.code"
			name="payment-method"
			v-model="payment.paymentMethod"
			@change="$v.payment.paymentMethod.$touch(); changePaymentMethod();"
		/>
		<span class="checkmark" />
	</label>
</div>
```

And adding the following:

```html
<payment-methods
	:payment-methods="this.paymentMethods"
	:payment="this.payment"
	:validate="$v.payment"
	:change-payment-method="changePaymentMethod"
></payment-methods>
```

4. Import the component and add it to the component section:

```js
import PaymentMethods from "src/modules/vsf-payment-multisafepay/components/PaymentMethods";
```

![order-review](https://user-images.githubusercontent.com/54272995/77530313-69a5ac80-6e91-11ea-9999-b1b329fd61e7.png)

# Manage payment methods

To enable payment methods in your Vue Storefront checkout, follow these steps:

1. In your MultiSafepay account, enable the payment method. See the relevant [payment method page](/payments/methods/).
2. In your Magento 2 backend, in the MultiSafepay Payments for Magento 2 module, enable the payment method.
3. Add the payment method to the `payment_methods_mapping` property in the `order property` config.

Example:

```json
...
"orders": {
    "payment_methods_mapping": {
      "MAESTRO": "maestro",
      "BANKTRANS": "banktrans",
      "DIRECTBANK": "directbank",
      "GIROPAY": "giropay",
      "MISTERCASH": "mistercash",
      "EPS": "eps",
      "IDEAL": "ideal",
      "TRUSTLY": "trustly",
      "MASTERCARD": "mastercard",
      "VISA": "visa"
    },
}

```

To display the logo of each payment method, copy and paste the following code below `payment_methods_mapping_img`:

```json
    "payment_methods_mapping_img": {
      "MAESTRO": "maestro",
      "BANKTRANS": "banktransfer",
      "DIRECTBANK": "sofortbank",
      "GIROPAY": "giropay",
      "MISTERCASH": "mistercash",
      "EPS": "eps",
      "IDEAL": "ideal",
      "TRUSTLY": "trustly",
      "MASTERCARD": "master",
      "VISA": "visa"
    },
```

![payment-methods](https://user-images.githubusercontent.com/54272995/77526212-7ecb0d00-6e8a-11ea-8e9b-4d5fd9376c06.png)

# Note

It's not yet possible to pay for orders placed when the user is offline.

# Support

For support or questions, create an issue in this repository or email the Integration Team at <a href="mailto:integrationt@multisafepay.com">integration@multisafepay.com</a>

# Thanks to Lakefields

Thanks to Lakefields as this project is based on their [integration](https://github.com/Lakefields/vsf-payment-service). :heart:

# License

[MIT License](https://github.com/MultiSafepay/vsf-payment-multisafepay/blob/master/LICENSE)

# Join us

Are you a developer interested in working at MultiSafepay? Check out our [job openings](https://www.multisafepay.com/careers/#jobopenings) and feel free to get in touch.
