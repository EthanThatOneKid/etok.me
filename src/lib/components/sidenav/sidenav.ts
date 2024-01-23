export interface SidenavLink {
	href: string;
	content: string;
}

export interface SidenavCategory {
	title: string;
	links: SidenavLink[];
}

export interface SidenavData {
	title: string;
	categories: SidenavCategory[];
}
