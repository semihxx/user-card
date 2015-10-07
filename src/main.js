// template http://codepen.io/ademilter/pen/EVmxXG/
var UserCard = multiline(function() {
  /*
  <div class="UserCardWrap">
    <div class="UserCard">
      <div class="UserCardProfile">
        <img class="UserCardProfile_photo" src="{{user-avatar_url}}&s=150" alt="" />
        <a class="UserCardProfile_name" href="{{user-html_url}}">
          <strong>{{user-name}}</strong>
        </a>
        <p class="UserCardProfile_username">{{user-login}}</p>
      </div>
      <!-- /UserCardProfile -->

      <div class="UserCardDetail">

        <ul class="UserCardInfo">
          <li>
            <span class="octicon octicon-organization"></span> {{user-type}}
          </li>
          <li>
            <span class="octicon octicon-location"></span> {{user-location}}
          </li>
          <li>
            <span class="octicon octicon-mail"></span> <a href="mailto:{{user-email}}">{{user-email}}</a>
          </li>
          <li>
            <span class="octicon octicon-link"></span> <a href="{{user-blog}}">{{user-blog}}</a>
          </li>
          <li>
            <span class="octicon octicon-clock"></span> Joined on {{user-created_at}}
          </li>
        </ul>
        <!-- /UserCardInfo -->

        <ul class="UserCardStats">
          <li class="UserCardStats_frame">
            <h5 class="UserCardStats_count">
              <a href="">{{user-followers}}</a>
            </h5>
            <p class="UserCardStats_title">
              <small>Followers</small>
            </p>
          </li>
          
          <li class="UserCardStats_frame">
            <h5 class="UserCardStats_count">
              <a href="">{{user-following}}</a>
            </h5>
            <p class="UserCardStats_title">
              <small>Following</small>
            </p>
          </li>
          <li class="UserCardStats_frame">
            <h5 class="UserCardStats_count">
              <a href="">{{user-public_repos}}</a>
            </h5>
            <p class="UserCardStats_title">
              <small>Repos</small>
            </p>
          </li>
        </ul>
        <!-- /UserCardStats -->

        <ul class="UserCardOrganize">
          <li card-repeater>
            <a href="https://github.com/{{orgs-login}}">
              <img src="{{orgs-avatar_url}}&s=150" alt="" />
            </a>
          </li>
        </ul>
        <!-- /UserCardOrganize -->

      </div>
      <!-- /UserCardDetail -->
    <div>
  </div>
    */
});

var whatTheClass = ".author, .user-mention";
var renderTemplate = function (prefix) {
  prefix = prefix || "";
  return function (data) {
    var patt;
    if (data instanceof Array) renderRepeater(data, prefix);
    else UserCard = UserCard.render(data, prefix); 
  }
}

var renderRepeater = function (data, prefix) {
  var d = $.parseHTML( UserCard );
  var elem = $(d[1]).find("[card-repeater]");

  var repeater = "";
  for (var i = data.length - 1; i >= 0; i--) {
    repeater += elem[0].outerHTML.render(data[i], prefix);
  };

  $(d[1]).find( "[card-repeater]" ).replaceWith( repeater );
  UserCard = d[1].outerHTML;
}

String.prototype.render = function (data, prefix) {
  var $this = this;
  $.each(data, function(index, value) {
    patt = new RegExp("{{("+ prefix + index + ")}}", "gm");
    $this = $this.replace(patt, value);
  }); 
  return $this;
}

$(document).ready(function () {
  var urlUser = "https://api.github.com/users/" + $(whatTheClass).find("a span").text();
  var urlOrg  = urlUser+"/orgs";

    $.get(urlUser)
      .done(renderTemplate("user-"));

    $.get(urlOrg)
      .done(renderTemplate("orgs-"));

});

$(document).on('mouseenter', whatTheClass, function() {
  var thisPosition = $(this).offset();
  var thisHeight = $(this).height();
  var arrowHeight = 10;
  var $this = $(this);
  
  timer = setTimeout(function() {
   
    $('body').append(UserCard);

    $('.UserCardWrap').css({
      "position": "absolute",
      "padding-top":40,
      "left": thisPosition.left,
      "top": thisPosition.top + thisHeight + arrowHeight -40
    });

  }, 300)
});

$(document).on('mouseleave', '.UserCardWrap', function() {
  $('.UserCardWrap').remove();
  clearTimeout(timer);
});
