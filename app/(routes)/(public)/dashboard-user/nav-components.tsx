"use client";
import { IconButton } from "@/components/ui/button";
import { useUserContext } from "@/context/user-context";
import { motion } from "framer-motion";
import { ChevronLeft, CircleUserRound, Package, Settings, Store, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ProfilNavBar = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const { user } = useUserContext();
	const router = useRouter();

	const routes = user?.role === "pro" ? ProfilProRoutes : ProfilRoutes;

	return (
		<>
			<div
				className={
					" absolute bottom-0 left-0 top-0 z-20 flex  h-full flex-col items-center justify-start gap-4 overflow-hidden  rounded-r-md bg-background p-4 shadow-lg transition-all duration-500 "
				}
			>
				<IconButton
					onClick={() => setOpen(!open)}
					Icon={ChevronLeft}
					iconClassName={"h-4 w-4  transition-all duration-500  group-data-[state=true]/icon:rotate-0  rotate-180"}
					title={open ? "fermer" : "ouvrir"}
					data-state={open}
					className="group/icon flex w-full items-center justify-center  transition-all duration-500"
				/>
				{routes.map(({ Icon, title, href }, index) => {
					const active = isActiveRoute(href, pathname);
					return (
						<button
							type="button"
							key={title}
							onClick={() => {
								router.push(href);
								setOpen(false);
							}}
							data-state={open}
							className={
								"justify-left relative flex w-[200px] items-center gap-2 rounded-md px-4 py-2 transition-all duration-500 hover:opacity-50 data-[state=false]:w-[50px]"
							}
							// style={{
							//   transformStyle: "preserve-3d",
							// }}
						>
							{active && (
								<motion.div
									layoutId="clickedbutton"
									data-state={open}
									transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
									className={"absolute inset-0 rounded-md bg-gray-200 data-[state=true]:ml-2 dark:bg-zinc-800 "}
								/>
							)}
							<Icon className="relative size-4 shrink-0 " />
							<span
								data-state={open}
								className="relative whitespace-nowrap transition-all data-[state=false]:opacity-0"
							>
								{title}
							</span>
						</button>
					);
				})}
			</div>
			{!user?.name && (pathname === "/dashboard-user" || pathname === "/dashboard-user/orders") && (
				<NewMessageUser expand={open} />
			)}
		</>
	);
};

function NewMessageUser({ expand }: { expand?: boolean }) {
	const [visible, setVisible] = useState(true);
	return (
		<>
			<style jsx>{`
   
      .bubble:before {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 24px solid #22C55D;
        border-right: 12px solid transparent;
        border-top: 12px solid #22C55D;
        border-bottom: 20px solid transparent;
        left: 6px;
        bottom: -24px;
        opacity: 0.95;
      }
      `}</style>
			<div
				data-state={visible}
				data-expand={expand}
				className={
					"bubble data-[state=false]:opacity-0 data-[expand=true]:left-36 transition-all duration-500 rounded-xl absolute top-24 left-14 z-30 bg-green-500/95   text-center p-5 "
				}
			>
				Compléter votre profile{" "}
				<IconButton
					className="absolute -top-2 -right-2 p-1"
					Icon={X}
					onClick={() => setVisible(false)}
					iconClassName="size-4 text-destructive"
				></IconButton>
			</div>
		</>
	);
}

const isActiveRoute = (href: string, pathname: string): boolean => {
	if (href === "/dashboard-user") {
		return pathname === href;
	}
	return pathname.startsWith(href);
};

export const ProfilRoutes = [
	{
		title: "Profil",
		Icon: CircleUserRound,
		href: "/dashboard-user",
	},
	{
		title: "Conmmandes",
		Icon: Package,
		href: "/dashboard-user/orders",
	},
	{
		title: "Modifier le profil",
		Icon: Settings,
		href: "/dashboard-user/settings",
	},
];

const ProfilProRoutes = [
	...ProfilRoutes,
	{
		title: "Produits Pro",
		Icon: Store,
		href: "/dashboard-user/produits-pro",
	},
];

export { ProfilNavBar };
