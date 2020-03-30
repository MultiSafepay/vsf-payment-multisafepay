import { RouteConfig } from 'vue-router'
import OrderStatus from '../pages/OrderStatus.vue'

let routes: RouteConfig[] = []
routes = routes.concat([
  { name: 'order-status', path: '/order-status', component: OrderStatus }
])
export default routes
