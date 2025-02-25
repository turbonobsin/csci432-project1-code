import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn.vue";
import Main from "@/views/Main.vue";
import Join from "@/views/Join.vue";
import Profile from "@/views/Profile.vue";
import QuickNav from "@/views/QuickNav.vue";
import ProfileSettings from "@/views/ProfileSettings.vue";
import MainWelcome from "@/views/MainWelcome.vue";
import { createWebHashHistory } from "vue-router";
import MessageFeed from "@/views/MessageFeed.vue";
import SearchUsers from "@/views/SearchUsers.vue";
import PrivateMessages from "@/views/PrivateMessages.vue";

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
						centerView: MessageFeed,
						rightView: MainWelcome
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
				},
				{
					path:"/user",
					name:"user",
					components:{
						leftView: QuickNav,
						centerView: SearchUsers
					}
				},
				{
					path:"/user/:userId",
					components:{
						leftView: QuickNav,
						centerView: SearchUsers,
						rightView: PrivateMessages
					},
					props: true
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
