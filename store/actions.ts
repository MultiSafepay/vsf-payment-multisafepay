import { PaymentServiceState } from '../types/PaymentServiceState';
import { ActionTree } from 'vuex';
import * as types from './mutation-types';
import fetch from 'isomorphic-fetch';
import i18n from '@vue-storefront/i18n';
import has from 'lodash-es/has';
import { router } from '@vue-storefront/core/app';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { Logger } from '@vue-storefront/core/lib/logger';
import { IDEAL } from '../const';

export const actions: ActionTree<PaymentServiceState, any> = {
  async fetchPaymentMethods ({ rootState, commit, dispatch }) {
    try {
      const fetchPaymentMethods = await fetch(
        rootState.config.paymentService.endpoint + '/payment-methods'
      );
      const paymentMethodsJson = await fetchPaymentMethods.json();

      if (paymentMethodsJson.result.data.length === 0) {
        throw new Error('No payment methods configured');
      }
      let paymentMethods = [];
      let backendEnabledPaymentMethods = rootState.config.orders.payment_methods_mapping;
      let paymentMethodsImg = rootState.config.orders.payment_methods_mapping_img;
      paymentMethodsJson.result.data.forEach(method => {
        if (has(backendEnabledPaymentMethods, method.id)) {
          let paymentMethodConfig = {
            title: method.description,
            code: method.id.toLowerCase(),
            image: `https://media.multisafepay.com/img/methods/svg/${
              paymentMethodsImg[method.id]
            }.svg`,
            mspMethod: true
          };

          paymentMethods.push(paymentMethodConfig);
          commit(types.ADD_METHOD, paymentMethodConfig);
        }
      });
      if (paymentMethods.some(paymentMethod => paymentMethod.code === IDEAL)) {
        dispatch('fetchIssuers');
      }

      dispatch('checkout/replacePaymentMethods', paymentMethods, {
        root: true
      });
    } catch (err) {
      Logger.info("Can't fetch payment methods", 'Payment service', err)();
    }
  },

  async fetchIssuers ({ rootState, commit }) {
    try {
      const fetchIssuers = await fetch(
        rootState.config.paymentService.endpoint + '/fetch-issuers'
      );
      const issuersJson = await fetchIssuers.json();
      if (issuersJson.result.data.length === 0) {
        throw new Error('No issuers');
      }
      commit(types.CLEAR_ISSUERS);
      issuersJson.result.data.forEach(issuer => {
        let { description, code } = issuer;
        let issuerConfig = {
          name: description,
          id: code
        };
        commit(types.ADD_ISSUER, issuerConfig);
      });
    } catch (err) {
      Logger.info("Can't fetch issuers", 'Payment service', err)();
    }
  },

  async createPayment ({ rootState }, payload) {
    let fetchUrl = rootState.config.paymentService.endpoint + '/post-payment';
    let params = {
      currency: rootState.config.i18n.currencyCode,
      order_id: payload.order_id,
      description: payload.payment_description,
      redirectUrl: location.origin + '/order-status',
      method: rootState.checkout.paymentDetails.paymentMethod,
      amount: payload.amount
    };
    if (rootState.checkout.paymentDetails.paymentMethod === IDEAL) {
      params['issuer'] = rootState['payment-service'].issuer.id;
    }
    Logger.info('Collected payment data. ', 'Payment service', params)();

    try {
      const resp = await fetch(fetchUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return await resp.json();
    } catch (error) {
      console.error(error);
    }
  },

  async postOrderComment ({ rootState }, payload) {
    let fetchUrl = rootState.config.paymentService.endpoint + '/order-comments';
    let params = {
      order_id: payload.order_id,
      order_comment: {
        statusHistory: {
          comment: payload.order_comment,
          created_at: new Date(),
          is_customer_notified: 0,
          is_visible_on_front: 0,
          parent_id: payload.order_id,
          status: payload.status
        }
      }
    };

    try {
      const resp = await fetch(fetchUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return await resp.json();
    } catch (error) {
      console.error(error);
    }
  },

  async getPaymentStatus ({ rootState }, payload) {
    let fetchUrl =
            rootState.config.paymentService.endpoint + '/get-payment-status';
    let params = { order_id: payload.order_id };

    try {
      const resp = await fetch(fetchUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return await resp.json();
    } catch (error) {
      console.error(error);
    }
  },

  setError ({ dispatch }, payload) {
    const { message, order_id, redirectUrl } = payload;
    Logger.error(message, 'Payment service')();
    dispatch(
      'notification/spawnNotification',
      {
        type: 'error',
        message: i18n.t('Payment is not created - ' + message),
        action1: { label: i18n.t('OK') },
        hasNoTimeout: true
      },
      { root: true }
    );
    const order_comment_data = {
      order_id: order_id,
      order_comment: 'Payment could not be created: ' + message,
      status: 'canceled'
    };
    dispatch('postOrderComment', order_comment_data);
    dispatch('checkout/setThankYouPage', false, { root: true });
    router.push(localizedRoute('/', redirectUrl));
  }
};
