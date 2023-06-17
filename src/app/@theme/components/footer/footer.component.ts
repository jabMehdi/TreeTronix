import { Component } from "@angular/core";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <span class="created-by"
      >Developed by
      <b>
        <a href="http://treetronix.com/" target="_blank"
          >Treetronix &copy; 2022
        </a></b
      ></span
    >
    <div class="socials">
      <a
        href="https://www.facebook.com/treetronix"
        target="_blank"
        class="ion ion-social-facebook"
      ></a>

      <a
        href="https://www.linkedin.com/company/treetronix/"
        target="_blank"
        class="ion ion-social-linkedin"
      ></a>
    </div>
  `
})
export class FooterComponent {}
