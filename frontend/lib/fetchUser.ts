import type { NextApiRequest } from "next";
import type { User } from "types";
import axios from "axios";

type FetchUser = ({
                      cookies,
                  }: {
    cookies: NextApiRequest["cookies"];
}) => Promise<User | null>;

export const fetchUser: FetchUser = async ({ cookies }) => {
    const token = cookies?.token;
    if (!token) return null;

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const user = response?.data;
        if (!user) return null;
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};