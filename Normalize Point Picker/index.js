window.onload = function(){
    let input = document.querySelector("#fileInput");
    let output = document.querySelector("#fileOutput");
    let outputHolder = document.querySelector("#output-holder")
    
    console.log(input);

    input.addEventListener("change", function(e){
        console.log("here");
        output.src = URL.createObjectURL(e.target.files[0]);

        output.onload = function()
        {
           console.log(outputHolder.getBoundingClientRect().width);
           let parentWidth = outputHolder.getBoundingClientRect().width;
           let parentHeight = outputHolder.getBoundingClientRect().height;

           let aspectRatio = output.naturalWidth / output.naturalHeight;
           console.log(aspectRatio);

           let newWidth = parentWidth;
           let newHeight = parentWidth / aspectRatio;

           if(newHeight > parentHeight){
            newHeight = parentHeight;
            newWidth = parentHeight * aspectRatio;
           }

           output.style.width = newWidth + "px";
           output.style.height = newHeight + "px";
        }
    })
};

