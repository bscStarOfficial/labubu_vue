import { createRouter, createWebHistory } from "vue-router";
import {getWeb3} from "@/js/web3";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/nft/index.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  await getWeb3();
  next()
})
export default router;
