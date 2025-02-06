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
import { createWebHashHistory } from "vue-router";

const router = createRouter({
	// history:createWebHistory(import.meta.env.BASE_URL),
	history:createWebHashHistory(),
	routes:[
		{
			path:"/main",
			name:"main2",
			component: Main,
			children:[
				{
					path:"",
					name:"main",
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
			path:"/join",
			name:"join",
			component: Join
		}
	],
});

export default router;
