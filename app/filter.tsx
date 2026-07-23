"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";

export const FilterBlock = ({
  minPrice,
  maxPrice,
  minYear,
  maxYear,
  minMile,
  maxMile,
}: {
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  minMile: number;
  maxMile: number;
}) => {
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [year, setYear] = useState([minYear, maxYear]);
  const [mileage, setMileage] = useState([minMile, maxMile]);

  const params = useParams<{ user?: string; dayRange?: string }>();

  return (
    <div className="w-full flex gap-6 flex-col text-sm">
      <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between w-full">
        <div className="lg:w-1/4 w-full flex gap-4 flex-col">
          <div className="flex justify-between">
            <div className="font-bold">Price</div>
            <div>
              {price[0].toLocaleString()} - {price[1].toLocaleString()}
            </div>
          </div>
          <Slider
            id="price"
            value={price}
            onValueChange={(value) => setPrice(value as number[])}
            min={minPrice}
            max={maxPrice}
            step={100}
          />
        </div>
        <div className="lg:w-1/4 w-full flex gap-4 flex-col">
          <div className="flex justify-between">
            <div className="font-bold">Year</div>
            <div>
              {year[0]} - {year[1]}
            </div>
          </div>
          <Slider
            id="year"
            value={year}
            onValueChange={(value) => setYear(value as number[])}
            min={minYear}
            max={maxYear}
            step={1}
          />
        </div>
        <div className="lg:w-1/4 w-full flex gap-4 flex-col">
          <div className="flex justify-between">
            <div className="font-bold">Mileage</div>
            <div>
              {mileage[0]} Km - {mileage[1]} Km
            </div>
          </div>
          <Slider
            id="year"
            value={mileage}
            onValueChange={(value) => setMileage(value as number[])}
            min={minMile}
            max={maxMile}
            step={1}
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            const np = new URLSearchParams();

            np.set("price", `${price[0]}-${price[1]}`);
            np.set("year", `${year[0]}-${year[1]}`);
            np.set("mileage", `${mileage[0]}-${mileage[1]}`);
            if (params.user) np.set("user", `${params.user}`);
            if (params.dayRange) np.set("dayRange", params.dayRange);

            redirect(`/?${np.toString()}`);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
