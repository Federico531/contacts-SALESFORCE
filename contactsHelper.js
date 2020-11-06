({
	createContact : function(component, contact) {
        
        var action = component.get("c.saveContact"); // saveContact: Metodo de ContactController.apxc
        
        action.setParams({
            "contact": contact
        });
        
        action.setCallback(this, function(response){
            
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var contacts = component.get("v.contacts");               
                contacts.push(response.getReturnValue());
                component.set("v.contacts", contacts);
            }
        });
        $A.enqueueAction(action);
        
        let button = component.find('saveButton');
        button.set('v.disabled', true);
    },
    insertData: function(component, valorABuscar, respuesta) {
        
        var id = valorABuscar;       
        var nombre = JSON.parse(respuesta).name;      
        var altura = JSON.parse(respuesta).height;
        var genero = JSON.parse(respuesta).gender;
        var colorCabello = JSON.parse(respuesta).skin_color;
        var colorOjos = JSON.parse(respuesta).eye_color;
        var url = JSON.parse(respuesta).url;
        var planeta = JSON.parse(respuesta).homeworld;
        
        let valores = [id, nombre, altura, genero, colorCabello, colorOjos, url];
        let nuevosValores = []
        
        // Recorro los valores, si alguno es "n/a" o "unknow" mando lo campos vacios
        for(var i=0; i<valores.length; i++){
            if(valores[i] === "n/a" || valores[i] === "unknown"){
                valores[i] = "";               
                nuevosValores.push(valores[i]);
            } else {
                nuevosValores.push(valores[i]);                
            }
        }

        component.set('v.newContact.IDCharacter__c', nuevosValores[0]);
        component.set('v.newContact.LastName', nuevosValores[1]);
        component.set('v.newContact.Height__c', nuevosValores[2]);         
        component.set('v.newContact.Gender__c', nuevosValores[3]);
        component.set('v.newContact.HairColor__c', nuevosValores[4]);
        component.set('v.newContact.EyeColor__c', nuevosValores[5]);
        component.set('v.newContact.URL__c', nuevosValores[6]);
              
        //******************** CODIGO PARA OBTENER EL PLANETA ***********************
        
        var valor = planeta.slice(29,-1); // Manipulo el string y obtengo el numero del planeta        
        var dato = 'planets';
        
        // Crear la accion
        var action = component.get("c.llamarALaApi");
        
        action.setParams({
            "valorABuscar": valor,
            "dato": dato
        });
        
        // Agregar comportamiento de la callback para cuando se recibe la respuesta
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var res = response.getReturnValue();
                var planet = JSON.parse(res).name;
                
                // Si el planeta es desconocido mando el campo vacio
                if(planet === "unknown"){
                    planet = "";
                }
                
                component.set('v.newContact.Homeworld__c', planet);                

        		//Deshabilito los campos que estan vacios
        		component.find("contactform").forEach(function(valor) {
           		if(valor.get("v.value") !== ""){
                    valor.set("v.disabled", true);
                } else {           		
                    valor.set("v.disabled", false);
                	}
        		});         
                        
        	}
            else {
                console.log("Falló con el estado planeta: " + state);
            }
        });   
        
        // Enviar acción para ejecutar
        $A.enqueueAction(action); 
         
       	
        //***************** FIN CODIGO PARA OBTENER EL PLANETA ************************
        
    }  
    
    
    //hasta aca anda
   
})
