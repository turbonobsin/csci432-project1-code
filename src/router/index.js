import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import Main from "@/views/Main.vue";
import Join from "@/views/Join.vue";
// import { createRouter } from "../../node_modules/vue-router/dist/vue-router";
import Profile from "@/views/Profile.vue";
import QuickNav from "@/views/QuickNav.vue";
import ProfileSettings from "@/views/ProfileSettings.vue";
import MainWelcome from "@/views/MainWelcome.vue";

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
					path:"/main",
					components:{
						leftView: QuickNav,
						centerView: MainWelcome
					}
				},
				{
					path:"/profile",
					name:"profile",
					components:{
						leftView: QuickNav,
						centerView: Profile
					}
				},
				{
					path:"/profile/settings",
					components:{
						leftView: QuickNav,
						centerView: Profile,
						rightView: ProfileSettings
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
