import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import "dirham/css";
import { DirhamIcon } from "dirham/react";
import Image from "next/image";
import { Search } from "lucide-react";
import { pool } from "@/lib/pg";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SuccessModal } from "./success-modal";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{
        [key: string]: string | undefined;
    }>;
}) {
    const sp = await searchParams;

    const success = sp?.success;
    const pay = sp?.pay;
    const checkoutId = sp?.checkoutId;
    const payer = sp?.user;

    if (success && checkoutId) {
        return <SuccessModal />;
    } else if (pay) {
        return <SuccessModal check />;
    }

    const dateRange = sp?.dateRange;

    let result;

    if (dateRange == "past7days") {
        result = await pool.query(
            "select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE - INTERVAL '7 days') and region is not null order by price asc ",
        );
    } else if (dateRange == "past30days") {
        result = await pool.query(
            "select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE - INTERVAL '30 days') and region is not null order by price asc ",
        );
    } else {
        result = await pool.query(
            "select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE) and region is not null order by price asc ",
        );
    }

    const search = sp?.search;

    if (search) {
        if (payer) {
            result = await pool.query(
                "select * from listing l join cars c on l.car_id = c.id where model ilike $1 or make ilike $1 or title ilike '%'||$1||'%'",
                [search],
            );
        } else {
            return <SuccessModal check />;
        }
    }

    const rows = result.rows;

    return (
        <div className="flex flex-col w-full gap-16 items-center">
            <h1 className="text-4xl">Hello Petrol Heads</h1>
            <div className="w-full">
                <form action="/" method="GET">
                    {payer && <input type="hidden" name="user" value={payer} />}
                    <InputGroup className=" w-full">
                        <InputGroupInput
                            defaultValue={search}
                            name="search"
                            placeholder="Search..."
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end" className="p-2">
                            <Button size="xs" type="submit">
                                Search
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </form>
            </div>
            <div className="flex gap-4 justify-between">
                <Link href={`?${payer ? `user=${payer}&` : ""}dateRange=today`}>
                    <Button variant={"outline"}>Today</Button>
                </Link>
                <Link
                    href={`?${payer ? `user=${payer}` : "pay=true"}&dateRange=past7days`}
                >
                    <Button variant={"outline"}>Past 7 days</Button>
                </Link>
                <Link
                    href={`?${payer ? `user=${payer}` : "pay=true"}&dateRange=past30days`}
                >
                    <Button variant={"outline"}>Past 30 days</Button>
                </Link>
            </div>
            <div className="md:grid-cols-2 xl:grid-cols-3 grid-cols-1 w-full gap-4 grid">
                {rows.map((r) => {
                    return (
                        <Card key={r.id} className="relative mx-auto w-full max-w-sm pt-0">
                            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                            <Image
                                src={r.img}
                                alt={r.title}
                                width={400}
                                height={400}
                                className="relative z-20 aspect-video w-full object-cover  grayscale dark:brightness-100"
                            />
                            <CardHeader>
                                <CardAction>
                                    <Badge>
                                        {r.price?.toLocaleString()} <DirhamIcon size="0.75em" />
                                    </Badge>
                                </CardAction>
                                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {r.title}
                                </CardTitle>
                                <CardDescription className="text-sm mt-4 h-24 flex flex-col gap-1">
                                    <div />
                                    <div>
                                        {r.year}- {r.region} specs
                                    </div>

                                    <div>VIN: {r.vin}</div>
                                    <div />
                                    <div />
                                    <div>{r.mileage.toLocaleString()} KM</div>
                                    <div>{r.category}</div>
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <a className="w-full" href={`https://reddit.com${r.link}`}>
                                    <Button className="w-full">Check on Reddit</Button>
                                </a>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
