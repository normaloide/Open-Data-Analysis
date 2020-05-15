// Questo script genera un file json contenente l'intero dataset in forma gerarchica temporale, in cui le foglie di ciascun osservazione (giorno) sono le sue features, utilizzando il formato solo name (tutti i dati sono sotto forma di stringa che è il nome del nodo, non sono presenti valori).

import java.util.Scanner;
import java.io.File;
import java.text.DecimalFormat;

public class TreeScriptAll
	{
	public static void main (String[] args)
		{
		try
			{
			File csv = new File(args[0]);			// Carica il csv
			Scanner input = new Scanner(csv);		// Avvia iteratore su csv
			input.useDelimiter("\n");				// Imposta limite di ciascuna stringa letta: newline
			String[] tokenArr;						// Array per token per ciascuna stringa
			
			input.next();							// Salta la prima riga del csv e scartala
			
			// Inserisci il csv in un array
			String[] rows = new String[3391];		//dataset di 3390 elementi + stopcode
			for (int i = 0; input.hasNext(); i++)
				{
				rows[i] = input.next();
				}
			rows[3390] = "TERMINATIONCODE";			// Hack: il codice ha più di 10 lettere, quindi quando viene effettuata la comparazione per mesi e anni essa risulterà falsa senza produrre errori. Scelta fatta principalmente per semplicità del codice, evita di usare un if-else in fase di controllo.
			
			// printArray(rows); // SOLO DEBUG
			
			DecimalFormat format = new DecimalFormat("0.00");		// Formattatore di cifre decimali. Il pattern significa: 2 cifre, anche zeri, dopo il punto decimale.
			
			int currentRow = 0;					// Contatore globale della riga attuale
			// Segnali usati per controllare i loop:
			boolean signalMore = true;			// Indica se ci sono ancora righe da scorrere
			boolean signalMoreM = true;			// Indica se ci sono ancora righe da scorrere (mesi)
			boolean signalMoreD = true;			// Indica se ci sono ancora righe da scorrere (giorni)
			
			System.out.print ("{\n\"name\": \"2008 - 2018\",\n\"children\": [\n");
			
			
			for (int yCount = 2008; signalMore; yCount++)
				{
				signalMoreM = true;
				System.out.print ("{\n\"name\": \"" + Integer.toString(yCount) + "\",\n\"children\": [\n");
				
				while (signalMoreM)
					{
					signalMoreD = true;
					System.out.print ("{\n\"name\": \"" + monthParser(Integer.parseInt(rows[currentRow].substring(3,5))) + "\",\n\"children\": [\n");
					
					for (; signalMoreD; currentRow++)			// NB: FORMATO DATA: DD/MM/AAAA // GIORNO: substring(0,2) // MESE: substring (3,5) // ANNO : substring (6,10)
						{
						tokenArr = rows[currentRow].split(",");	
						
						System.out.print ("{\n\"name\": \"" + tokenArr[0].substring(0,2) + "\",\n\"children\": [\n");
						
						// Controllo valori mancanti
						
						
						// Scrittura valori
						System.out.print("{ \"name\": \"PM10: " + formatNa(tokenArr[1], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"NO2:  " + formatNa(tokenArr[2], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"CO:   " + formatNa(tokenArr[3], format) +" mg/m3\"},\n");
						System.out.print("{ \"name\": \"O3:   " + formatNa(tokenArr[4], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"C6H6: " + formatNa(tokenArr[5], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"SO2:  " + formatNa(tokenArr[6], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"PM25: " + formatNa(tokenArr[7], format) +" µg/m3\"},\n");
						System.out.print("{ \"name\": \"Valutazione: " + naIfEmpty(tokenArr[8].strip()) +"\"}\n");	// L'ultima voce contiene newline che vanno rimosse
						//DUMMY
						
						// lookahead: compara le date della stringa attuale con quella successiva e controlla se essa è lo stopcode
						// si appoggia al fatto che tutte le righe iniziano sempre con una data in un formato dato 
						if (!stringEquals(rows[currentRow].substring(3,5), rows[currentRow+1].substring(3,5))) signalMoreD = false;		// Fine del mese
						if (!stringEquals(rows[currentRow].substring(6,10), rows[currentRow+1].substring(6,10))) signalMoreM = false;	// Fine dell'anno
						if (rows[currentRow+1].equals("TERMINATIONCODE")) signalMore = false;											// Fine del file
						
						if (signalMoreD) System.out.print ("]\n},\n"); else System.out.print ("]\n}\n");
						}
						
					//signalMoreM = false;
					if (signalMoreM) System.out.print ("]\n},\n"); else System.out.print ("]\n}\n");
					}
				
				//signalMore = false;
				if (signalMore) System.out.print ("]\n},\n"); else System.out.print ("]\n}\n");
				// Niente virgola se è l'ultima voce dell'elenco
				}	
		
			System.out.println	("]\n}");
			}
		
		catch (Exception e)
			{
			System.out.println(e);
			}
		}
	
	public static String monthParser (int month)				// Per avere mesi testuali, è più carino e comprensibile nel grafico
		{
		switch (month)
			{
			case 1: return "January";
			case 2: return "February";
			case 3: return "March";
			case 4: return "April";
			case 5: return "May";
			case 6: return "June";
			case 7: return "July";
			case 8: return "August";
			case 9: return "September";
			case 10: return "October";
			case 11: return "November";
			case 12: return "December";
			default: return "ERROR";
			}
		}
	
	public static void printArray (String[] arr)				// Solo per debug
		{
		System.out.println("[]");
		for (int i = 0; i < arr.length; i++)
			{
			System.out.println(arr[i]);
			}
		System.out.println("[]");
		}

	public static boolean stringEquals (String a, String b)		// Metodo di comodo
		{
		return a.equals(b);
		}
	
	public static String formatNa (String s, DecimalFormat fm)	// Rilevazione dati mancanti e formattazione numerica
		{
		if (s.equals("")) return "N/A"; else return fm.format(Double.parseDouble(s));
		}
	
	public static String naIfEmpty (String s)					// SOLO rilevazione dati mancanti, serve per i dati che non sono numeri (valutazione)
		{
		if (s.equals("")) return "N/A"; else return s;
		}
	}
