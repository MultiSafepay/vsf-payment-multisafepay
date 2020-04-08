<p align="center">
  <img src="https://www.multisafepay.com/img/multisafepaylogo.svg" width="400px" position="center">
</p>

# MultiSafepay Payment Service module for Vue Storefront v1.11.1

MultiSafepay Payments API integration for Vue Storefront with Magento 2 as backend system.

## About MultiSafepay

MultiSafepay is a collecting payment service provider which means we take care of the agreements, technical details and payment collection required for each payment method. You can start selling online today and manage all your transactions from one place.

![order-status](https://user-images.githubusercontent.com/54272995/77526252-91dddd00-6e8a-11ea-8985-b916a3d067f9.png)

Image shown above is the order status page after the customer successfullly paid for an order.

# Requirements

- To use this module you need a MultiSafepay account. You can create a test account on https://testmerchant.multisafepay.com/signup

# Installation Guide

Follow these steps to install this module in Vue Storefront.

First, make sure you meet these requirements for your Magento 2 installation.

# Requirements for Magento 2

The requirements for the MultiSafepay Payments for Magento 2 module can be found [here](https://github.com/MultiSafepay/Magento2Msp)

Please follow the installation steps in the README file.

# Requirements for Vue Storefront API

Add the Vue Storefront API extension we created for the [MultiSafepay Payments API](https://github.com/MultiSafepay/vsf-multisafepay-service-api)

Please follow the installation steps in the README file.

# Requirements for Vue Storefront

After making sure that the abovementioned requirements are met, please follow the next steps to integrate this module to Vue Storefront.

Clone this git repository from within your vue-storefront root folder

```shell
git clone git@github.com:MultiSafepay/vsf-payment-multisafepay.git src/modules/vsf-payment-multisafepay
```

# Module registration

Open `src/modules/client.ts`

Add:

```ts
...
import { MultiSafePayPaymentModule } from './vsf-payment-multisafepay'
```

And make sure to also register the module in registerClientModules

```js
registerModule(MultiSafePayPaymentModule);
```

# Add configuration settings

Add the config properties in `config/local.json`

```json
"paymentService": {
"endpoint": "http://localhost:8080/api/ext/vsf-multisafepay-service-api"
},
```

Make sure to set the correct location to your API and the routes to the CMS pages in case of an error or an invalid payment status check.

# Integration to theme

We used the default theme, below we'll sum up the changes that are necessary to completely integrate this module to your own theme if you're not using Vue Storefront default theme. We create a isolate components for separate the logic from VSF core but it's necessary to make a few small changes on the core as well.

- Copy and paste the checkout page as we change one v-show condition of thank you page to v-if

```html
<thank-you-page v-if="isThankYouPage" />
```

- As we redirect to MultiSafepay gateweay after placed the order VSF show the default ThankYouPage so we have to add here a notification on the created method. You can copy and paste the file.

```js
created(){
    this.$bus.$emit('notification-progress-start', [this.$t('Redirecting to MultiSafepay'), '...'].join(''))
  },
```

- Add PaymentMethods component into Payment checkout component to display Multisafepay payment methods, you can do with two differents approaches:

1º You can copy/paste the Payment component from this module to your default theme

Or

2º The first one is removing the following code on Payment componet (core/blocks/Checkout/Payment.vue):

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

And adding this one:

```html
<payment-methods
	:payment-methods="this.paymentMethods"
	:payment="this.payment"
	:validate="$v.payment"
	:change-payment-method="changePaymentMethod"
></payment-methods>
```

Remember also to import the component and add it on component section:

```js
import PaymentMethods from "src/modules/vsf-payment-multisafepay/components/PaymentMethods";
```

![order-review](https://user-images.githubusercontent.com/54272995/77530313-69a5ac80-6e91-11ea-9999-b1b329fd61e7.png)

# Manage payment methods

To enable payment methods in your Vue Storefront checkout you have to follow these steps:

1. Enable the payment method in your MultiSafepay Control
2. Enable the payment method in the MultiSafepay Payments for Magento 2 module in your Magento 2 backend system
3. Add the payment methods to the payment_methods_mapping property in the order property config.

Here is a example:

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

To display the images of each payment methods you have to below payment_methods_mapping the mapping for images, just copy and paste the following code:

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

# Important notes

It's not yet possible to pay for orders that are placed when the user is offline.

# Support

If you have any issues, problems or questions you can create an issue on this repository or contact us at <a href="mailto:integrationt@multisafepay.com">integration@multisafepay.com</a>

# Thanks to Lakefields

Thanks to Lakefields as this project is based on their [integration](https://github.com/Lakefields/vsf-payment-service). :heart:

# License

[MIT License](https://github.com/MultiSafepay/vsf-payment-multisafepay/blob/master/LICENSE)

# Want to be part of the team?

Are you a developer interested in working at MultiSafepay? [View](https://www.multisafepay.com/careers/#jobopenings) our job openings and feel free to get in touch with us.
