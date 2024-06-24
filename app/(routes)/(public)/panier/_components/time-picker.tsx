import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { setHours, setMinutes } from "date-fns";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeCartUrl } from "./summary";

type HourPickerProps = {
	className?: string;
	date: Date;
	shopId: string | undefined;
};

const TimePicker = ({ className, date, shopId }: HourPickerProps) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (
		date.getHours() < 8 ||
		(date.getHours() === 8 && date.getMinutes() < 30) ||
		date.getHours() > 18 ||
		(date.getHours() === 18 && date.getMinutes() > 30)
	) {
		router.replace(makeCartUrl(shopId, setMinutes(setHours(date, 8), 30)), {
			scroll: false,
		});
		return null;
	}

	const onSelectTime = (dateValue: string) => {
		const selectedDate = new Date(dateValue);

		router.replace(makeCartUrl(shopId, selectedDate), {
			scroll: false,
		});
	};

	const timeOptions = generateTimeOptions(date);
	return (
		<>
			<div className={cn("relative flex flex-wrap items-center justify-between gap-y-2", className)}>
				<div className="text-base font-medium text-secondary-foreground">Heure de retrait</div>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" role="combobox" aria-expanded={open} className="w-[240px] justify-between">
							{date.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
							<Icons.Clock className="ml-auto h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandList>
								<CommandGroup>
									{timeOptions.map((time) => {
										const dateValue = time.toISOString();
										const displayDate = time.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										});
										return (
											<CommandItem
												key={dateValue}
												value={dateValue}
												onSelect={(currentValue) => {
													onSelectTime(currentValue);
													setOpen(false);
												}}
											>
												<Check
													className={cn("mr-2 h-4 w-4", date.toISOString() === dateValue ? "opacity-100" : "opacity-0")}
												/>
												{displayDate}
											</CommandItem>
										);
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
			<p className="pr-4 text-sm text-muted-foreground">
				Venex aux heures de la traite entre 8h30-9h30 et 18h-19h pour avoir du lait frais.
			</p>
		</>
	);
};

export default TimePicker;

export const generateTimeOptions = (date: Date) => {
	const times = [];
	let start = new Date(new Date(date).setHours(8, 30, 0, 0));

	const end = new Date(new Date(date).setHours(18, 30, 0, 0));

	while (start <= end) {
		times.push(start);
		start = new Date(start.getTime() + 30 * 60000); // add 30 minutes
	}

	return times;
};

//
