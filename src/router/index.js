import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import Main from "@/views/Main.vue";
import Join from "@/views/Join.vue";
// import { createRouter } from "../../node_modules/vue-router/dist/vue-router";
import Profile from "@/views/Profile.vue";

const router = createRouter({
	history:createWebHistory(import.meta.env.BASE_URL),
	routes:[
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path:"/signin",
			name:"signin",
			component: SignIn
		},
		{
			path:"/main",
			name:"main",
			component: Main,
			children:[
				{
					path:"/profile",
					name:"profile",
					components:{
						centerView: Profile
					}
				}
			]
		},
		{
			path:"/join",
			name:"join",
			component: Join
		}
	],
});

export default router;
