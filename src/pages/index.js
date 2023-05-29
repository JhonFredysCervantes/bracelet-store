import { Inter } from "next/font/google";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState, useEffect } from "react";

import braceletsToSave from "../data/bracelets.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [bracelets, setBracelets] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [materiales, setMateriales] = useState([]);
  const [materialSelected, setMaterialSelected] = useState(null);
  const [dijes, setDijes] = useState([]);
  const [dijeSelected, setDijeSelected] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [tipoSelected, setTipoSelected] = useState(null);
  const [priceBracelet, setPriceBracelet] = useState(0);
  const [currencies, setCurrencies] = useState(["COP", "USD"]);
  const [currency, setCurrency] = useState("USD");

  const calculatePrice = () => {
    bracelets
      .filter(
        (bracelet) =>
          bracelet.material == materialSelected &&
          bracelet.dije == dijeSelected &&
          bracelet.tipo == tipoSelected
      )
      .forEach((bracelet) => {
        let result = bracelet.valor * quantity;

        if (currency == "COP") {
          result = result * 5000;
        }
        setPriceBracelet(result);
      });
  };

  const getbracelets = async () => {
    try {
      await onSnapshot(collection(db, "bracelets"), (snapshot) => {
        const newArray = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setBracelets(newArray);
        setMateriales([
          ...new Set(newArray.map((elemento) => elemento.material)),
        ]);
        setDijes([...new Set(newArray.map((elemento) => elemento.dije))]);
        setTipos([...new Set(newArray.map((elemento) => elemento.tipo))]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const saveBracelets = async () => {
    console.log(braceletsToSave);
    braceletsToSave.forEach(async (bracelet) => {
      try {
        const docRef = await addDoc(collection(db, "bracelets"), {
          material: bracelet.material,
          dije: bracelet.dije,
          tipo: bracelet.tipo,
          valor: bracelet.valor,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });
  };

  useEffect(() => {
    getbracelets();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [materialSelected, dijeSelected, tipoSelected, quantity, currency]);

  return (
    <main className={`p-24 ${inter.className}`}>
      <h1 className="text-4xl font-bold row">Crea tu propio manilla</h1>
      <div className="flex col">
        <div className="m-8">
          <label>Material: </label>
          {
            <select
              value={materialSelected}
              onChange={(e) => setMaterialSelected(e.target.value)}
            >
              <option value="none">Selecciona una opción</option>
              {materiales.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          }
        </div>

        <div className="m-8">
          <label>Dije: </label>
          {
            <select
              value={dijeSelected}
              onChange={(e) => setDijeSelected(e.target.value)}
            >
              <option value="none">Selecciona una opción</option>
              {dijes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          }
        </div>

        <div className="m-8">
          <label>Tipo: </label>
          {
            <select
              value={tipoSelected}
              onChange={(e) => setTipoSelected(e.target.value)}
            >
              <option value="none">Selecciona una opción</option>
              {tipos.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          }
        </div>
        <div className="col-12">
          <label>Cantidad</label>
          <input
            type="number"
            placeholder="Cuantas deseas?"
            className="border-2 border-gray-200 rounded-md p-1 m-6"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
          />
        </div>
        <div className="m-8">
          <label>Moneda: </label>
          {
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {currencies.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          }
        </div>
      </div>
      <div className="flex col-12">
        <div className="flex bg-amber-300 w-64 h-32 ml-auto p-10">
          <p className="text-2xl font-bold">Total: </p>
          <h2 className="text-2xl"> ${priceBracelet.toLocaleString('es')}</h2>
        </div>
      </div>
    </main>
  );
}
