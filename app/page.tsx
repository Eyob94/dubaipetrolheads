import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import "dirham/css";
import { DirhamIcon } from "dirham/react";
import Image from "next/image";
import { LockIcon, Search } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { FilterBlock } from "./filter";
import clsx from "clsx";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}) {
  const sp = await searchParams;

  const dateRange = sp?.dateRange;
  const year = sp?.year;
  const mileage = sp?.mileage;
  const price = sp?.price;

  let result;

  if (dateRange == "past7days") {
    result = await pool.query(
      `select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE - INTERVAL '7 days') and region is not null   order by price asc `,
    );
  } else if (dateRange == "past14days") {
    result = await pool.query(
      `select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE - INTERVAL '14 days') and region is not null  order by price asc `,
    );
  } else {
    result = await pool.query(
      `select * from listing l join cars c on l.car_id = c.id where time > (CURRENT_DATE - INTERVAL '1 days') and region is not null  order by price asc `,
    );
  }

  const search = sp?.search;

  if (search) {
    result = await pool.query(
      "select * from listing l join cars c on l.car_id = c.id where model ilike $1 or make ilike $1 or title ilike '%'||$1||'%'",
      [search],
    );
  }

  const rows = result.rows;

  const priceRange = rows.reduce(
    (acc, row) => {
      if (row.price > acc[1]) {
        acc[1] = row.price;
      }
      if (row.price < acc[0]) {
        acc[0] = row.price;
      }

      return acc;
    },

    [Infinity, -Infinity],
  );

  const yearRange = rows.reduce(
    (acc, row) => {
      const y = Number(row.year);
      if (isNaN(y) || y == 0) return acc;
      if (y > acc[1]) acc[1] = y;
      if (y < acc[0]) acc[0] = y;
      return acc;
    },
    [Infinity, -Infinity],
  );
  const mileageRange = rows.reduce(
    (acc, row) => {
      const y = Number(row.mileage);
      if (isNaN(y) || y == 0) return acc;
      if (y > acc[1]) acc[1] = y;
      if (y < acc[0]) acc[0] = y;
      return acc;
    },
    [Infinity, -Infinity],
  );

  return (
    <div className="flex flex-col w-full gap-16 items-center">
      <h1 className="text-4xl">Hello Petrol Heads</h1>
      <div className="w-full">
        <form action="/" method="GET">
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
        <Link href={`?dateRange=past2days`} className="relative">
          <Button variant={"outline"}>Past 2 days</Button>
        </Link>
        <Link href={`?dateRange=past7days`} className="relative">
          <Button variant={"outline"}>Past 7 days</Button>
        </Link>
        <Link href={`?dateRange=past14days`} className="relative">
          <Button variant={"outline"}>Past 14 days</Button>
        </Link>
      </div>
      <FilterBlock
        minPrice={priceRange[0]}
        maxPrice={priceRange[1]}
        minYear={yearRange[0]}
        maxYear={yearRange[1]}
        minMile={mileageRange[0]}
        maxMile={mileageRange[1]}
      />
      <Separator />
      <div className="md:grid-cols-2 xl:grid-cols-3 grid-cols-1 w-full gap-4 grid">
        {rows
          .filter((r) => {
            if (year)
              return (
                r.year >= year?.split("-")[0] && r.year <= year?.split("-")[1]
              );
            else return r;
          })
          .filter((r) => {
            if (mileage)
              return (
                r.mileage >= mileage?.split("-")[0] &&
                r.mileage <= mileage?.split("-")[1]
              );
            else return r;
          })
          .filter((r) => {
            if (price)
              return (
                r.price >= price?.split("-")[0] &&
                r.price <= price?.split("-")[1]
              );
            else return r;
          })
          .map((r) => {
            return (
              <Card
                key={r.id}
                className="relative mx-auto w-full max-w-sm pt-0"
              >
                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                <Image
                  src={r.img}
                  alt={r.title}
                  width={400}
                  height={400}
                  className={clsx(
                    "relative z-20 aspect-video w-full object-cover  grayscale dark:brightness-100",
                  )}
                />
                {false ? (
                  <div className="w-full flex-col h-full gap-8 flex justify-center items-center">
                    <div className="items-center flex gap-4">
                      <LockIcon />
                      <span>Upgrade to Unlock</span>
                    </div>
                    <div>
                      <Link
                        target="_blank"
                        href="https://buy.polar.sh/polar_cl_pheNFEkMXPVKB538BhBMBnXUIi7E7NqYGwlna239A4E"
                      >
                        <Button>Upgrade</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader>
                      <CardAction>
                        <Badge>
                          {r.price?.toLocaleString()}{" "}
                          <DirhamIcon size="0.75em" />
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
                      <a
                        className="w-full"
                        href={`https://reddit.com${r.link}`}
                      >
                        <Button className="w-full">Check on Reddit</Button>
                      </a>
                    </CardFooter>
                  </>
                )}
              </Card>
            );
          })}
      </div>
    </div>
  );
}
