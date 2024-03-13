import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

const Admin = () => {
  const { getAll } = useIndexedDB("registrations");
  const [persons, setPersons] = useState<any[]>([]);

  useEffect(() => {
    getAll().then((personsFromDB) => {
      setPersons(personsFromDB);
    });
  }, []);

  return (
    <div>
      {persons.map((person) => (
        <span>{JSON.stringify(person)}</span>
      ))}
    </div>
  );
};

export default Admin;
