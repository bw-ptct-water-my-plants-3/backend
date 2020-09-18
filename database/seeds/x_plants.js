exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("plants")
    .truncate()
    .then(function () {
      return knex("plants").insert([
        {
          id: 1,
          user_id: 1,
          nickname: "sunflower",
          species: "annualforbof",
          h20Frequency: 2,
          image:
            "https://images.search.yahoo.com/search/images;_ylt=Awr9Imc9DWRf9k0Ar3JXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=sunflower&fr2=piv-web&fr=mcafee#id=2&iurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fa%2Fa9%2FA_sunflower.jpg&action=click",
        },
        {
          id: 2,
          user_id: 2,
          nickname: "tulips",
          species: "Liliaceae",
          h20Frequency: 4,
          image:
            "https://images.search.yahoo.com/search/images;_ylt=Awr9NEkVDWRfszMAQVmJzbkF;_ylu=X3oDMTBsZ29xY3ZzBHNlYwNzZWFyY2gEc2xrA2J1dHRvbg--;_ylc=X1MDOTYwNjI4NTcEX3IDMgRhY3RuA2NsawRjc3JjcHZpZAM2UGNKWURFd0xqSThXQmdVWG1MU1hRSVRNall3TVFBQUFBQm9xYWtWBGZyA21jYWZlZQRmcjIDc2EtZ3AEZ3ByaWQDNndIRUkxeUFTcDZRLmdkT2hwNDFfQQRuX3N1Z2cDMTAEb3JpZ2luA2ltYWdlcy5zZWFyY2gueWFob28uY29tBHBvcwMwBHBxc3RyAwRwcXN0cmwDBHFzdHJsAzUEcXVlcnkDdHVsaXAEdF9zdG1wAzE2MDAzOTI0ODE-?p=tulip&fr=mcafee&fr2=sb-top-images.search&ei=UTF-8&n=60&x=wrt#id=48&iurl=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2F736x%2Fb4%2Fc7%2F16%2Fb4c716ddface1a7ef8f6c54151c15def.jpg&action=click",
        },
        {
          id: 3,
          user_id: 3,
          nickname: "rose",
          species: "Rosaceae",
          h20Frequency: 3,
          image:
            "https://www.google.com/search?q=roses&sxsrf=ALeKk01LiHyP0ljcMgipOUZTEmNBmuizZg:1600392332382&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiz8OODxvHrAhUYrZ4KHfTUCykQ_AUoAXoECBoQAw&biw=1920&bih=937#imgrc=Azs_hsFLA07_uM",
        },
      ]);
    });
};
