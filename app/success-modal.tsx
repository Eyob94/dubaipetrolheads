"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { v4 } from "uuid";

export function SuccessModal({ check = false }: { check?: boolean }) {
    useEffect(() => {
        const payer = localStorage.getItem("payer");
        if (payer) {
            return redirect(`/?user=${payer}`);
        } else if (check) {
            redirect(
                "https://buy.polar.sh/polar_cl_pheNFEkMXPVKB538BhBMBnXUIi7E7NqYGwlna239A4E",
            );
        }
        const id = v4();
        localStorage.setItem("payer", id);
        return redirect(`/?user=${id}`);
    }, [check]);

    return <div />;
}
