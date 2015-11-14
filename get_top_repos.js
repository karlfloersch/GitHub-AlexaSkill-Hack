
// Count all of the links from the io.js build page 
var jsdom = require("jsdom");

var github_json = [];
 
jsdom.env(
  "http://gitmostwanted.com/?lang=All&status=promising",
  ["http://code.jquery.com/jquery.js"],
  function (err, window) {
    console.log("there have been", window.$("a").length - 4, " test! io.js releases!");
    var stars = window.$(".fi-star").parent();
    stars.each(function( index ) {
      github_json.push({"stars": window.$( this ).text().replace(/\s/g, "").replace("+", "")});
      console.log( index + ": " + window.$( this ).text().replace(/\s/g, "").replace("+", "") );
    });
    // Get all the stars like this:
    //"
    //            +240 
    //          
    //            +224 
    //          
    //            +221 
    //          
    //            +195 
    //          
    //            +159 
    //          
    //            +114 
    //          
    //            +94 
    //          
    //            +79 
    //          
    //            +72 
    //          
    //            +68 
    //          "
    
    var desc = window.$(".fi-star").parent().parent().parent().find("p");
    desc.each(function( index ) {
      github_json[index]["description"] = window.$( this ).text();
      console.log( index + ": " + window.$( this ).text() );
    });
    // Get all descriptions like this:
    // "Assistive Context-Aware ToolkitOpen Internet for everyone. Lantern is a free desktop application that delivers fast, reliable and secure access to the open Internet.The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.The http://FreeCodeCamp.com open-source codebase and curriculum. Practice coding by helping nonprofits.A huge list of frontend development resources I collected over time. Sorted from general knowledge at the top to concrete problems at the bottom.Transforming styles with JS pluginsThe definitive list of lists (of lists) curated on GitHubMaterial Design Lite Components in HTML/CSS/JSA curated list of awesome listsBuild cross platform desktop apps with web technologies"
    
    var name = window.$(".fi-star").parent().parent().parent().find("h4").find("a");
    name.each(function( index ) {
      var github_name = window.$( this ).text().split("\/");
      console.log(github_name[0]);
      console.log(github_name[1]);
      github_json[index]["author"] = github_name[0];
      github_json[index]["repository"] = github_name[1];
      console.log( index + ": " + window.$( this ).text() );
    });

    console.log("\n\n\n\n");
    console.log(github_json);
    console.log("\n\n\n\n");

    console.log("startEles");
    // console.log(startEles);

  }
);
