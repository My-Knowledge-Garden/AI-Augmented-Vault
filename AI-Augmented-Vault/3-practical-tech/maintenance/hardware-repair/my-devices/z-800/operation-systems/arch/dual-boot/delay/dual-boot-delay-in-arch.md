---
title: Pause the menu indefinitely until I make a choice
gem dev: https://www.google.com/search?q=change+boot+delay+in+arch&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQLhhA0gEJMzc0OTBqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8&udm=50&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpmAsnXCN5UBx17opt8eaTX-kA7ovRmAIYWC70eULDzbpKhLTwdBViyqaMPX_061dAwvylJWuEcOlkFAuhKr9Q_7wRLf6N0QG1i1fC1JHKmxXHWXLZdD6fVWJg0bk85JlmDVb8Qqp_0XbtpMYoG3xM4RSrXIr2tXW8xi_VDSTDK8BNNW6jShQ0xKHRcD_hmWZFnc3lEg&aep=10&ntc=1&mstk=AUtExfALi4RvkHZYgPrythviL7HpRbCGHgM5XS7nFSlq8QEzLsledrI_ISI27EiOp_znpcHOBUjg0kobYLEQHyau54UiiLmMca8vFRKANDLEQe8prmZB7utUrgooNRqylEEJcGS7AmU_PAw5nW18D6iHS7AeW-wZ8ndDgI06UicsiKbYgV5Ej6NoTHztCYB_yuBYuRo0U-Pu4mwZHRUIK87SSR7oVXURuLgnysqMzOwu5t1-FdHTBYVZSxo07KdCUzzoFoTNdxlK2EX9UEVckfrkDNR7vJYpx2y_G4SlSk0UbH67tNrBSEc5DaOnuVyZ_iqixXRPnzJnX4hYOA&aioh=3&csuir=1&mtid=NqX3aY2cE5OokdUPnP-PcQ&atvm=2
---

```bash
➜  ~ sudo nano /etc/default/grub
[sudo] password for hassan:

```

Set indefinite timeout ==-1==
```nano
GRUB_TIMEOUT=-1
```

**==Crucial==:** Update the GRUB menu to apply the "wait forever" logic:
```bash
➜  ~ sudo grub-mkconfig -o /boot/grub/grub.cfg

Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux-lts
Found initrd image: /boot/initramfs-linux-lts.img
Warning: os-prober will be executed to detect other bootable partitions.
Its output will be used to detect bootable binaries on them and create new boot entries.
Found Windows 10 on /dev/sda1
Found Windows 10 on /dev/sdb1
Adding boot menu entry for UEFI Firmware Settings ...
done
➜  ~
```
