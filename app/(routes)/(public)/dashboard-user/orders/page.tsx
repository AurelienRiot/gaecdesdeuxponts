"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { createProduct, createProductList, createStatus } from "@/components/table-custom-fuction/cell-orders";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { cn, currencyFormatter } from "@/lib/utils";
import {
	type OrderColumnType,
	OrdersColumn,
	searchableColumns,
	viewOptionsColumns,
	filterableColumns,
} from "./_components/order-column";
import { useState } from "react";
import { IconButton } from "@/components/ui/button";
import { X } from "lucide-react";

const PageOrderTable = () => {
	const { user } = useUserContext();

	if (!user) {
		return (
			<div className="w-full space-y-4 p-6">
				<Heading title={`Commandes `} description="Résumé des commandes" />
				<Separator />
				<DataTableSkeleton columnCount={6} filterableColumnCount={2} searchableColumnCount={1} />
			</div>
		);
	}

	const formattedOrders: OrderColumnType[] = (user.orders || []).map((order) => ({
		id: order.id,
		productsList: createProductList(order),
		products: createProduct(order),
		totalPrice: currencyFormatter.format(order.totalPrice),
		status: createStatus(order),
		datePickUp: order.datePickUp,
		shopName: order.shop?.name || "Livraison à domicile",
		shop: order.shop || undefined,
		createdAt: order.createdAt,
	}));

	return (
		<>
			<div className="w-full space-y-4 p-6">
				<Heading title={`Commandes (${formattedOrders.length})`} description="Résumé des commandes" />
				<Separator />
				<DataTable
					data={formattedOrders}
					columns={OrdersColumn}
					searchableColumns={searchableColumns}
					filterableColumns={filterableColumns()}
					viewOptionsColumns={viewOptionsColumns}
				/>
			</div>
		</>
	);
};

export default PageOrderTable;
