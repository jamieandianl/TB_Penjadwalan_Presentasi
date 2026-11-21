package com.example.TubesRPL.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Frontend berupa single-page app (HTML + CSS + JavaScript) di folder
 * src/main/resources/static. Semua URL halaman diarahkan ke index.html,
 * lalu JavaScript (js/app.js) yang menampilkan halaman sesuai URL.
 * Ini membuat refresh browser di /dashboard/mahasiswa dst. tetap berfungsi.
 */
@Controller
public class PageController {

	@GetMapping({
			"/login/mahasiswa",
			"/login/dosen",
			"/dashboard/mahasiswa",
			"/jadwal/mahasiswa",
			"/tugas-besar/mahasiswa",
			"/tugas-besar/edit",
			"/dashboard/dosen",
			"/dosen/kelola-kelompok",
			"/dosen/matriks",
			"/dosen/penjadwalan",
			"/admin/data",
			"/admin/jadwal"
	})
	public String spaPages() {
		return "forward:/index.html";
	}
}
