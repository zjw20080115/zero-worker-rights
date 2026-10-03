package com.rights.helper.controller;
import com.rights.helper.model.User; import com.rights.helper.repository.UserRepository; import jakarta.servlet.http.HttpSession; import org.springframework.http.*; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/auth") public class AuthController {
 private final UserRepository users; private final BCryptPasswordEncoder enc=new BCryptPasswordEncoder();
 public AuthController(UserRepository users){this.users=users;}
 @PostMapping("/register") public ResponseEntity<?> register(@RequestBody Map<String,String> b,HttpSession s){String u=val(b,"username"),p=val(b,"password"),n=val(b,"nickname"); if(u.length()<3||p.length()<6)return ResponseEntity.badRequest().body(Map.of("message","用户名至少3位，密码至少6位")); if(users.findByUsername(u).isPresent())return ResponseEntity.status(409).body(Map.of("message","用户名已存在")); User x=new User();x.username=u;x.password=enc.encode(p);x.nickname=n.isBlank()?u:n;users.save(x);s.setAttribute("userId",x.id);return ResponseEntity.ok(Map.of("id",x.id,"username",x.username,"nickname",x.nickname));}
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody Map<String,String> b,HttpSession s){Optional<User> o=users.findByUsername(val(b,"username"));if(o.isEmpty()||!enc.matches(val(b,"password"),o.get().password))return ResponseEntity.status(401).body(Map.of("message","用户名或密码错误"));User x=o.get();s.setAttribute("userId",x.id);return ResponseEntity.ok(Map.of("id",x.id,"username",x.username,"nickname",x.nickname));}
 @PostMapping("/logout") public Map<String,String> logout(HttpSession s){s.invalidate();return Map.of("message","已退出");}
 @GetMapping("/me") public ResponseEntity<?> me(HttpSession s){Object id=s.getAttribute("userId");if(id==null)return ResponseEntity.status(401).build();User x=users.findById((Long)id).orElseThrow();return ResponseEntity.ok(Map.of("id",x.id,"username",x.username,"nickname",x.nickname));}
 private String val(Map<String,String>b,String k){return b.getOrDefault(k,"").trim();}
}
