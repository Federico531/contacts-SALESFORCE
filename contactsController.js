({
    // Cargar contactos de Salesforce
    doInit: function(component, event, helper) {
        // Crear la accion
        var action = component.get("c.getContacts");
        
        // Agregar comportamiento de la callback para cuando se recibe la respuesta
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            
            if (state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());                
            }
            else {
                console.log("Falló con el estado: " + state);
            }
        });
        // Enviar acción para ejecutar
        $A.enqueueAction(action);        
    },
    
   
	buscar : function(component, event, helper) {      
        
        // Verifico si obtengo bien el valor desde el campo		       
        var valorABuscar = component.find('expenseformID').get('v.value'); //Obtengo el valor (ID) a buscar en la API
        
        //**** PRUEBA 
        
        //**** FIN PRUEBA
        
        //validacion para que trainga solo personajes que existan desde la API
        if(valorABuscar >= 1 && valorABuscar <89){ // INICIO DEL IF GENERAL DE VALIDACION DE ID        
        
        var dato = 'people';

        // Hago la llamada al metodo del controlador APEX (ContactController)
        var action = component.get("c.llamarALaApi");
        
        action.setParams({
            "valorABuscar": valorABuscar,
            "dato": dato
        });
                
        // Agregar comportamiento de la callback para cuando se recibe la respuesta
        action.setCallback(this, function(response) {
            
        var state = response.getState();
            
        if (state === "SUCCESS") {
            // Habilito el boton guardar, ya que se hizo la llamada a la API
            let button = component.find('saveButton');
            button.set('v.disabled', false);                  
           
            var respuesta = response.getReturnValue();
            helper.insertData(component, valorABuscar, respuesta);
        }
        else {
            console.log("Falló con el estado: " + state);
        }                    
        });
        // Enviar acción para ejecutar
        $A.enqueueAction(action);
        
        } // FIN DEL IF GENERAL DE VALIDACION DE ID VALIDO
	},
    
    // HASTA ACA COPIADO BIEN 
    
    // Me va a servir para guardar los datos del formulario...
    guardar: function(component, event, helper) {        
        // Buscar componentes con id=contactoform. Como no es unico devuelve una matriz de componentes. La cual la recorro
        // reduce: reduce la matriz a un solo valor capturado por "validoHastaAhora", el cual es verdadero hasta que encuentra un campo no valido.
        // puede ser campo obligatorio o vacio, o un numero inferior al minimo, etc.
        var validContact = component.find('contactform').reduce(function (validoHastaAhora, inputCmp) {
            // Muestra mensajes de error para campos no validos.
            inputCmp.showHelpMessageIfInvalid();
                        
            return validoHastaAhora && inputCmp.get('v.validity').valid; // Si ambos son true, da true
        }, true);
        
        // Si pasamos la comprobacion de errores...
        if(validContact){
            // Crea el nuevo contacto
            var newContact = component.get("v.newContact");
            console.log("Creo contacto: " + JSON.stringify(newContact)); // JSON.stringify: Convierte a texto
            helper.createContact(component, newContact); // Lo paso al helper...
        }        
    }
})
