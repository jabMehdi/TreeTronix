import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSearchService,
  NbSidebarService,
  NbThemeService
} from "@nebular/theme";
import * as mapboxgl from "mapbox-gl";
import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { User } from "../../../pages/auth/model/User";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  public app_username: any;

  themes = [
    {
      value: "default",
      name: "Light mode"
    },
    {
      value: "dark",
      name: "Dark mode"
    },
    {
      value: "cosmic",
      name: "Cosmic"
    }
  ];

  currentTheme = "cosmic";

  /* userMenu = [ { title: 'Logout' ,
                  link: '../../../auth/login',
             },
             ];*/
  userMenu = [];
  value = "";
  test = "";
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService
  ) {
    this.app_username = JSON.parse(localStorage.getItem("currentUser"));
    //  console.log(this.app_username.username) ;
    this.userMenu.push({
      title: this.app_username.username,
      link: "../../../auth/profile",
      icon: "person-outline"
    });
    this.userMenu.push({
      title: "Log out",
      link: "../../../auth/login",
      icon: "unlock-outline"
    });
    this.test = this.app_username.username;
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe(themeName => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
