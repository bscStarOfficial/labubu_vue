import { createRouter, createWebHistory } from "vue-router";
import {getWeb3} from "@/js/web3";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/nft/index.vue"),
    },
    {
      path: "/mutiSign01",
      component: () => import("@/views/admin/mutiSign01.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  await getWeb3();
  next()
})
export default router;
