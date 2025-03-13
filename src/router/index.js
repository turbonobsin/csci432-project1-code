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
import { useUserStore } from "@/stores/user.ts";

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
					},
					meta:{
						authRequired:true
					}
				},
				{
					path:"/profile",
					name:"profile",
					components:{
						leftView: QuickNav,
						centerView: Profile
					},
					meta:{
						authRequired:true
					}
				},
				{
					path:"/profile/settings",
					components:{
						leftView: QuickNav,
						centerView: Profile,
						rightView: ProfileSettings
					},
					meta:{
						authRequired:true
					}
				},
				{
					path:"/user",
					name:"user",
					components:{
						leftView: QuickNav,
						centerView: SearchUsers
					},
					meta:{
						authRequired:true
					}
				},
				{
					path:"/user/:userId",
					components:{
						leftView: QuickNav,
						centerView: SearchUsers,
						rightView: PrivateMessages
					},
					props: true,
					meta:{
						authRequired:true
					}
				}
			]
		},
		{
			path: "/",
			name: "home",
			component: Home,
			meta:{
				authRequired:false
			}
		},
		{
			path:"/signin",
			name:"signin",
			component: SignIn,
			meta:{
				authRequired:false
			}
		},
		{
			path:"/join",
			name:"join",
			component: Join,
			meta:{
				authRequired:false
			}
		}
	],
});

export function registerRouterGuards(){
	const userStore = useUserStore();

	// global nav guard
	router.beforeEach(async (to,from)=>{
		// 404 to home
		if(to.matched.length == 0){
			if(userStore.token){
				return "/main";
			}
			return "/";
		}
		
		// no auth to home
		if(to.meta.authRequired){
			if(userStore.token) return;
			return "/";
		}
	});
}

export default router;
