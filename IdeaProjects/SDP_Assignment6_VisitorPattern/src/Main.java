import element.Directory;
import element.File;
import visitor.SearchVisitor;
import visitor.SizeCalculatorVisitor;
import visitor.TreePrinterVisitor;

public class Main {
    public static void main(String[] args) {
        Directory root = new Directory("project");
        Directory src = new Directory("src");
        Directory docs = new Directory("docs");

        src.addElement(new File("Main.java", 1200));
        src.addElement(new File("Visitor.java", 600));
        docs.addElement(new File("Report.pdf", 8500));

        root.addElement(src);
        root.addElement(docs);
        root.addElement(new File("README.md", 400));

        // 1. TreePrinterVisitor (3rd visitor)
        System.out.println("--- File System Structure ---");
        root.accept(new TreePrinterVisitor());

        // 2. SizeCalculatorVisitor
        SizeCalculatorVisitor sizeVisitor = new SizeCalculatorVisitor();
        root.accept(sizeVisitor);
        System.out.println("\nTotal Size: " + sizeVisitor.getTotalSize() + " B");

        // 3. SearchVisitor
        SearchVisitor searchVisitor = new SearchVisitor(".java");
        root.accept(searchVisitor);
        System.out.println("\nSearch Results for '.java':");
        for (File file : searchVisitor.getFoundFiles()) {
            System.out.println("Found: " + file.getName() + " (" + file.getSizeInBytes() + " B)");
        }
    }
}