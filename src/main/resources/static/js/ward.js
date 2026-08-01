const WARD_API="/api/wards";
const ALLOCATION_API="/api/allocations";


document.addEventListener("DOMContentLoaded",()=>{


    loadWards();


    document.getElementById("wardForm")
        .addEventListener("submit",saveWard);



});




function loadWards(){


    fetch(WARD_API)

        .then(res=>res.json())

        .then(data=>{


            let table=document.getElementById("wardTable");


            table.innerHTML="";


            data.forEach(w=>{


                table.innerHTML += `

<tr>

<td>${w.wardId}</td>

<td>${w.wardName}</td>

<td>${w.capacity}</td>

<td>${w.occupiedBeds}</td>

<td>${w.capacity-w.occupiedBeds}</td>


<td>

<button class="edit-button">
Edit
</button>


<button class="delete-button">
Delete
</button>

</td>


</tr>

`;


            });


        })

        .catch(err=>console.log(err));


}





function saveWard(e){

    e.preventDefault();



    let ward={

        wardName:
        document.getElementById("wardName").value,


        capacity:
            Number(document.getElementById("capacity").value),


        occupiedBeds:
            Number(document.getElementById("occupiedBeds").value)

    };



    fetch(WARD_API,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(ward)


    })

        .then(res=>res.json())

        .then(()=>{


            alert("Ward Saved");


            loadWards();


        });


}





function clearWardForm(){

    document.getElementById("wardForm").reset();

    document.getElementById("occupiedBeds").value=0;

}





function clearAllocationForm(){

    document.getElementById("allocationForm").reset();

}