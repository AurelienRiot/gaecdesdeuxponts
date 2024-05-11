"use client";
import { formatPhoneNumber } from "react-phone-number-input";

const UserPhone = ({ phone }: { phone: string | null }) =>
  phone ? <p>{formatPhoneNumber(phone as any)}</p> : <p>Non renseigné</p>;

export default UserPhone;
