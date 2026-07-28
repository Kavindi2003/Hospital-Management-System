loadAppointments();





// ================= LOAD DATA =================


function loadAppointments(){


    fetch("/api/appointments")


        .then(res=>res.json())


        .then(data=>{


            let table=document.getElementById("appointmentData");


            table.innerHTML="";



            data.forEach(a=>{


                table.innerHTML += `


<tr>


<td>${a.appointmentId}</td>


<td>${a.patientId}</td>


<td>${a.doctorId}</td>


<td>${a.appointmentDate}</td>


<td>${a.reason}</td>



<td>


<button onclick="editAppointment(
${a.appointmentId},
${a.patientId},
${a.doctorId},
'${a.appointmentDate}',
'${a.reason}'
)">

Edit

</button>



<button onclick="deleteAppointment(${a.appointmentId})">

Delete

</button>


</td>



</tr>


`;


            });


        })


        .catch(error=>{


            console.log(error);


        });


}







// ================= CREATE + UPDATE =================



document
    .getElementById("appointmentForm")
    .addEventListener("submit",function(e){


        e.preventDefault();



        let id=document.getElementById("appointmentId").value;



        let appointment={



            patientId:
            document.getElementById("patientId").value,



            doctorId:
            document.getElementById("doctorId").value,



            appointmentDate:
            document.getElementById("appointmentDate").value,



            reason:
            document.getElementById("reason").value



        };




        let url="/api/appointments";


        let method="POST";




        if(id!=""){


            url="/api/appointments/"+id;


            method="PUT";


        }





        fetch(url,{


            method:method,


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify(appointment)


        })



            .then(res=>{


                if(!res.ok){

                    throw new Error("Save Failed");

                }


                return res.json();


            })



            .then(data=>{


                alert("Saved Successfully");


                loadAppointments();



                document
                    .getElementById("appointmentForm")
                    .reset();



                document
                    .getElementById("appointmentId")
                    .value="";



            })



            .catch(err=>{


                alert(err.message);


            });



    });








// ================= EDIT =================


function editAppointment(id,patient,doctor,date,reason){



    document.getElementById("appointmentId").value=id;


    document.getElementById("patientId").value=patient;


    document.getElementById("doctorId").value=doctor;



    document.getElementById("appointmentDate").value =
        date.substring(0,16);



    document.getElementById("reason").value=reason;



}








// ================= DELETE =================


function deleteAppointment(id){



    if(!confirm("Delete this appointment?")){

        return;

    }



    fetch("/api/appointments/"+id,{


        method:"DELETE"


    })


        .then(()=>{


            alert("Deleted Successfully");


            loadAppointments();


        });


}








// ================= SEARCH =================


function searchAppointment(){



    let keyword =
        document.getElementById("searchBox").value;



    fetch("/api/appointments/search?keyword="+keyword)



        .then(res=>res.json())



        .then(data=>{



            let table=document.getElementById("appointmentData");


            table.innerHTML="";



            data.forEach(a=>{



                table.innerHTML += `


<tr>


<td>${a.appointmentId}</td>


<td>${a.patientId}</td>


<td>${a.doctorId}</td>


<td>${a.appointmentDate}</td>


<td>${a.reason}</td>


<td>


<button onclick="editAppointment(
${a.appointmentId},
${a.patientId},
${a.doctorId},
'${a.appointmentDate}',
'${a.reason}'
)">

Edit

</button>



<button onclick="deleteAppointment(${a.appointmentId})">

Delete

</button>


</td>


</tr>


`;



            });


        });


}