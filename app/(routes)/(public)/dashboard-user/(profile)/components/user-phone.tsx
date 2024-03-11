"use client";
import { formatPhoneNumber } from "react-phone-number-input";

const UserPhone = ({ phone }: { phone: string | null }) =>
  phone ? <p>{formatPhoneNumber(phone)}</p> : <p>Non renseigné</p>;

export default UserPhone;
